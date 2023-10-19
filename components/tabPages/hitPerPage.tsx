import { Box, H2, Small, Form, Input, } from '@bigcommerce/big-design';

const HitPerPage = ({ searchConfig, updateHandler }) => {
    const {hitsPerPage} = searchConfig
    const handleChange = (e, name) => {
        
        if (e.target.value <= 200){
            updateHandler((prevConfig) => ({
                ...prevConfig,
                [name]: e.target.value,
            }));
        }
    };
    
    const contentTemplate = `
        "fields  prev" auto
        / 4fr 1.5fr;
    `;
    return (
        <Box marginLeft='xxxLarge'>
            <Box marginBottom="large">
                <H2>Hits per page</H2>
                <Small>Set the number of search results per page</Small>
                <Small>Default: 20</Small>
            </Box>
            <Form >
                <Input
                    type='number'
                    max="100"
                    required
                    placeholder={hitsPerPage}
                    value={hitsPerPage}
                    onChange = {(e) => handleChange(e, 'hitsPerPage') }/>
            </Form>
        </Box>
    )
};

export default HitPerPage;
