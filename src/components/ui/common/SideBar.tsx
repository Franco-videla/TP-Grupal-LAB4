
import { Link } from 'react-router-dom';
import { cilBarChart, cilFastfood } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';

export const SideBar = () => {

    return (
        <div>
            <CSidebar className="border-end d-flex flex-column" style={{ height: '100vh',width:'21vh', backgroundColor: '#e2e9d0' }}>
                <CSidebarNav>
                    <CNavTitle>
                        Menu
                    </CNavTitle>
                    <CNavItem>
                        <Link to="/" className="nav-link" >
                            <CIcon customClassName="nav-icon" icon={cilBarChart} />
                            Inicio
                        </Link>
                    </CNavItem>

                    <CNavItem>
                        <Link to="/" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilFastfood} />
                            Productos Manufacturados
                        </Link>
                    </CNavItem>
                </CSidebarNav>
            </CSidebar>
        </div>

        
    );
}

export default SideBar;
