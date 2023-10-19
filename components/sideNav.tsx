import { Box, Text } from '@bigcommerce/big-design';
import styles from '../styles/sideNav.module.css'

const SideNav = ({ tabChange, activeTab }) => {
    const tabs = activeTab?.map((tab) => {
        return (
            <Box
                backgroundColor={!tab.isActive ? "white" : "primary"}
                border="none"
                display="block"
                padding="medium"
                onClick={() => tabChange(tab.name)}
                className={styles.customHoverEffect}
            >
                <Text color={!tab.isActive ? "secondary70" : "primary20"} >{tab.caption}</Text>
            </Box>
        )
    })
    return(
    <div>
       {tabs}
    </div>
);
}
export default SideNav;
