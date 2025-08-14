import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton,Typography, Button, Switch, FormControlLabel } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
// import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
// import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
// import GreeneriaLogo from './Greeneria-Logo.png';
import green from './greneria.jpeg'

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  backgroundColor: 'white', // Set the background color to white
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isAutoMode, setIsAutoMode] = useState(true); // true for auto, false for manual
  const currentLocation = 'Microsoft, Hyderabad';
  const currentArea = '';
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); // Update every 1000 milliseconds (1 second)

    return () => clearInterval(interval);
  }, []);

  const handleModeToggle = () => {
    setIsAutoMode(!isAutoMode);
    console.log('Mode changed to:', !isAutoMode ? 'Auto' : 'Manual');
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        {/* <img
          src={GreeneriaLogo}
          alt="Greeneria Logo"
          style={{
            width: '250px', // Adjust the width as needed
            height: 'auto', // Maintain the aspect ratio
            cursor: 'pointer',
            marginLeft: '0px', // Adjust the left margin as needed
          }}
        />  */}

        {/* <Searchbar /> */}

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ textAlign: 'center', marginRight: 2 ,width: "50px"}}>
          <Typography variant="h5" color="text.primary" >
           <img src = {green} alt = 'demo' style = {{}}/>
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', marginRight: 2 }}>
          <Typography variant="h5" color="text.primary" >
            {currentTime}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', marginRight: 2 }}>
  <Typography variant="h5" color="text.primary">
    {currentLocation}
  </Typography>
  <Typography variant="h6" color="text.primary">
          {currentArea}
  </Typography>
</Box>

        
        <Box sx={{ flexGrow: 1}} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}

          {/* Toggle Button */}
          <FormControlLabel
            control={
              <Switch
                checked={isAutoMode}
                onChange={handleModeToggle}
                color="primary"
                size="small"
              />
            }
            label={isAutoMode ? 'Auto' : 'Manual'}
            sx={{
              marginRight: 2,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: 'text.primary',
                minWidth: '40px',
              },
            }}
          />

          <Button
            variant="contained"
            size="small"
            sx={{ marginRight: 2 }}
            // startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => { console.log('Header action button clicked'); }}
          >
            Log
          </Button>
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
