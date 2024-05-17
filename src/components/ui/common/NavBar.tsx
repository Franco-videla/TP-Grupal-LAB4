
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';

import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';


export const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor: '#a6c732'}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{color: '#FFFFBF', justifyContent: 'center' }}
          >
            <img src="/logo/buenSabor.png" alt="Logo de Buen Sabor" style={{ width: '130px', height: '35px', marginRight: '2px' }} />
            <LunchDiningOutlinedIcon sx={{color: '#FFFFBF',mr:1}}/>
           
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
           
            aria-haspopup="true"
          
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
     
    </Box>
  );
};
