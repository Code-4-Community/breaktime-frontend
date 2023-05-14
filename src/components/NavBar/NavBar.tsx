import React from 'react';
import { PAGE_ROUTES, defaultColors } from 'src/constants';
import {
  Box,
  Button,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  ButtonGroup
} from '@chakra-ui/react'
import {
  ChevronDownIcon
} from '@chakra-ui/icons';

const items =
  [{
    "title": "Timesheets",
    "link": PAGE_ROUTES.TIMECARD
  },
  {
    "title": "Search",
    "link": ""
  },
  {
    "title": "Home",
    "link": PAGE_ROUTES.ROOT
  }]



function NavBar() {
  return (
    <Flex boxShadow={'lg'} mb={'1%'} p={'0.75%'}>
      <Box>
        <Image rounded={'md'} src={'https://static.wixstatic.com/media/1193ef_371853f9145b445fb883f16ed7741b60~mv2.jpg/v1/crop/x_0,y_2,w_2200,h_400/fill/w_233,h_42,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Breaktime%20Logo%20Comfortaa-2.jpg'} alt='breaktime' />
      </Box>
      <Spacer />
      <ButtonGroup gap='1%'>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} rounded={'md'} bgColor={defaultColors.BREAKTIME_BLUE} textColor={'white'}>
            Menu
          </MenuButton>
          <MenuList>
            {items.map(
              (dropDownItem) =>
              (
                <MenuItem as='a' href={dropDownItem.link} key={dropDownItem.title}>
                  {dropDownItem.title}
                </MenuItem>
              )
            )}
          </MenuList>
        </Menu>
        <Spacer />
        <Button as='a' href={PAGE_ROUTES.LOGOUT} rounded={'md'} bgColor={defaultColors.BREAKTIME_BLUE} textColor={'white'}>
          Sign out
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

export default NavBar;
