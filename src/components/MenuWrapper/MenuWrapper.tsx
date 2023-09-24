import { MenuOption } from '@/types/misc'
import SettingsIcon from '@mui/icons-material/Settings'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

type Props = {
  children: React.ReactNode
  options: MenuOption[]
}

export const MenuWrapper = ({ children, options }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null)
  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)
  const handleClickListItem = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <>
      <SettingsIcon
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          padding: 20,
          cursor: 'pointer',
        }}
        fontSize="medium"
        onClick={handleClickListItem}
      />
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.title} onClick={option.onClick} disabled={option.disabled}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
      {children}
    </>
  )
}