import { Grid, GridItem, Box, H2, Small, Form, FormGroup, Input, Flex, FlexItem, Button, Select,Text, H3 } from '@bigcommerce/big-design';
import { SearchIcon } from '@bigcommerce/big-design-icons';
import style from '../../styles/styleOption.module.css'

const StyleOption = ({ searchConfig, updateHandler }) => {
    const { position, view, placeholder, bgColor, borderColor } = searchConfig
    const onInputChange = (e) => {
        updateHandler((prevConfig)=>({...prevConfig, [e.target.name]:e.target.value}))
    }
    const onSelectChange = (name, values) => {
        updateHandler((prevConfig) => ({
        ...prevConfig,
        [name]: { value:values.value, content: values.content }, 
    }));
    }
    const contentTemplate = `
        "fields  prev" auto
        / 4fr 1.5fr;
    `;
    return (
        <Grid gridTemplate={contentTemplate} padding="large">
            <GridItem gridArea="fields">
                <Box>
                    <Box marginBottom="large">
                        <H2>Search Page Style</H2>
                        <Small>Personalize Your Search Page Aesthetics</Small>
                    </Box>
                    <Form >
                        <table className={style.tableStyle}>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>Filter Position</p>
                                    </td>
                                    <td>
                                        <Select
                                        onOptionChange={(value,content)=>onSelectChange('position' ,content)}
                                        name='position'
                                        value={position?.value}
                                        options={[
                                        { value: 'left', content: 'Left' },
                                        { value: 'right', content: 'Right' },
                                        ]}
                                        placeholder={position?.content}
                                        required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Search View</p>
                                    </td>
                                    <td>
                                        <Select
                                        onOptionChange={(value,content)=>onSelectChange('view', content)}
                                        name='view'
                                        value={view?.value}
                                        options={[
                                        { value: 'full', content: 'Full' },
                                        { value: 'half', content: 'Half' },
                                        ]}
                                        placeholder={view?.content}
                                        required
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Placeholder</p>
                                    </td>
                                    <td>
                                        <Input name='placeholder' value={placeholder} onChange={onInputChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Background Color</p>
                                    </td>
                                    <td>
                                            <input className={style.inputMargin} id="header" type='color' name='bgColor' onChange={onInputChange} value={bgColor} />  
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Border Color</p>
                                    </td>
                                    <td>
                                            <input className={style.inputMargin} id="border" type='color' name='borderColor' onChange={onInputChange} value={ borderColor } />  
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
                    style={{backgroundColor: bgColor}}
                >
                    <Input
                    iconRight={<SearchIcon color={borderColor} />}
                        placeholder={searchConfig.placeholder}
                        disabled
                    />
                </Box>
            </GridItem>
        </Grid>
    )
};

export default StyleOption;
