import fs from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Popover } from '@/components/ui/Popover'

function getAllSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllSourceFiles(fullPath))
    } else if (/\.(ts|tsx|css)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }
  return files
}

describe('Architecture & Design System Guardrails', () => {
  const srcDir = path.resolve(__dirname, '..')
  const allFiles = getAllSourceFiles(srcDir)

  it('enforces zero imports of @iconify/react outside src/components/ui/Icon.tsx and bans lucide/heroicons/react-icons', () => {
    const violations: string[] = []

    for (const file of allFiles) {
      const rel = path.relative(srcDir, file).replace(/\\/g, '/')
      if (rel === 'test/architecture.test.tsx') continue

      const content = fs.readFileSync(file, 'utf-8')
      if (rel !== 'components/ui/Icon.tsx' && content.includes('@iconify/react')) {
        violations.push(`${rel} imports @iconify/react directly`)
      }
      if (/(lucide-react|react-icons|@heroicons)/.test(content)) {
        violations.push(`${rel} imports banned icon library`)
      }
    }

    expect(violations).toEqual([])
  })

  it('enforces zero raw hex colour literals outside src/styles/globals.css', () => {
    const hexRegex = /#[0-9a-fA-F]{3,8}\b/g
    const violations: string[] = []

    for (const file of allFiles) {
      const rel = path.relative(srcDir, file).replace(/\\/g, '/')
      if (rel === 'styles/globals.css' || rel === 'test/architecture.test.tsx') continue

      const content = fs.readFileSync(file, 'utf-8')
      const matches = content.match(hexRegex)
      if (matches) {
        violations.push(`${rel}: ${matches.join(', ')}`)
      }
    }

    expect(violations).toEqual([])
  })

  it('Popover supports keyboard opening, Escape dismissal, and returns focus to trigger', () => {
    render(
      <Popover
        trigger={({ open, toggle, setTriggerEl }) => (
          <button
            ref={setTriggerEl}
            type="button"
            aria-expanded={open}
            onClick={toggle}
          >
            Account Menu
          </button>
        )}
      >
        {() => <div>Menu Content</div>}
      </Popover>,
    )

    const triggerBtn = screen.getByRole('button', { name: 'Account Menu' })
    triggerBtn.focus()
    fireEvent.click(triggerBtn)

    expect(screen.getByRole('menu')).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(triggerBtn)
  })
})
