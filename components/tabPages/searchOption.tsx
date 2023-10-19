import { Grid, GridItem, Box, H2, Small, Form, Switch, Input, Flex, FlexItem, Button, Select,Text, H3 } from '@bigcommerce/big-design';
import { SearchIcon } from '@bigcommerce/big-design-icons';
import style from '../../styles/styleOption.module.css'

const StyleOption = ({ searchConfig, updateHandler }) => {
    const {filter, categories, prodDescription, displayPrice} = searchConfig
    
    const handleChange = (name) => {
        updateHandler((prevConfig) => ({
            ...prevConfig,
            [name]: !prevConfig[name],
        }))
    };
    const contentTemplate = `
        "fields  prev" auto
        / 4fr 1.5fr;
    `;
    return (
        <Grid gridTemplate={contentTemplate} padding="large">
            <GridItem gridArea="fields">
                <Box>
                    <Box marginBottom="large">
                        <H2>Search Option</H2>
                        <Small>Personalize Your Search Page</Small>
                    </Box>
                    <Form >
                        <table className={style.tableStyle}>
                            <tbody>
                                <tr>
                                    <td className={style.labelColumn}>
                                        <p>Show Filter</p>
                                    </td>
                                    <td>
                                        <Switch checked={filter} onChange={()=>handleChange('filter')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={style.labelColumn}>
                                        <p>Categories Suggestion</p>
                                    </td>
                                    <td>
                                        <Switch checked={categories} onChange={()=>handleChange('categories')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={style.labelColumn}>
                                        <p>Product Description</p>
                                    </td>
                                    <td>
                                        <Switch checked={prodDescription} onChange={()=>handleChange('prodDescription')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={style.labelColumn}>
                                        <p>Display Prices</p>
                                    </td>
                                    <td>
                                        <Switch checked={displayPrice} onChange={()=>handleChange('displayPrice')} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Form>
                </Box>
            </GridItem>
            <GridItem gridArea="prev">
                <H3>Preview</H3>
                <Box
                    border="box"
                    display="block"
                    padding="xxLarge"
                    style={{backgroundColor: searchConfig.bgColor}}
                >
                    <Input
                        iconRight={<SearchIcon color={searchConfig.borderColor} />}
                        placeholder={searchConfig.placeholder}
                        disabled
                    />
                </Box>
            </GridItem>
        </Grid>
    )
};

export default StyleOption;
