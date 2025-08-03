'use client'

import { DropdownMenu, Flex, Text } from '@radix-ui/themes'
import { BsDisplay, BsMoon, BsSun } from 'react-icons/bs'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()

    const themes = [
        { value: 'light', label: 'Light', icon: BsSun },
        { value: 'dark', label: 'Dark', icon: BsMoon },
        { value: 'system', label: 'System', icon: BsDisplay },
    ] as const

    const currentTheme = themes.find((t) => t.value === theme) || themes[0]
    const CurrentIcon = currentTheme.icon

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Flex
                    align="center"
                    gap="2"
                    className="px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                    <CurrentIcon size={16} />
                    <Text size="2">{currentTheme.label}</Text>
                </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {themes.map((themeOption) => {
                    const Icon = themeOption.icon
                    return (
                        <DropdownMenu.Item
                            key={themeOption.value}
                            onClick={() => setTheme(themeOption.value)}
                            className={
                                theme === themeOption.value
                                    ? 'bg-zinc-100 dark:bg-zinc-800'
                                    : ''
                            }
                        >
                            <Flex align="center" gap="2">
                                <Icon size={14} />
                                <Text size="2">{themeOption.label}</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    )
                })}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default ThemeToggle
