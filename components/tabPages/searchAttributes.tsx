import { Box, H2, Small, Form, FormGroup, MultiSelect, Text, Flex, FlexItem, Select} from '@bigcommerce/big-design';
import { DeleteIcon } from '@bigcommerce/big-design-icons';
import { useState } from 'react';

const SearchAttributes = ({ searchConfig, updateHandler }) => {
    const { searchAttributes } = searchConfig
    const [value, setValue] = useState(() => {
        const newValue=[]
        Object.keys(searchAttributes).forEach(key => {
           if(searchAttributes[key].isActive) newValue.push(key)
        });
        return newValue
    });
    const handleChange = (val) => {
        setValue(val)
        const updatedSearchAttributes = { ...searchConfig.searchAttributes };
        Object.keys(searchConfig.searchAttributes).forEach(key => {
           updatedSearchAttributes[key].isActive = val.includes(key);
        });

         updateHandler((prevConfig) => ({
            ...prevConfig,
            searchAttributes: updatedSearchAttributes
         }));
    };
    const handleSortChange = (val,name) => {
        updateHandler((prevConfig) => ({
            ...prevConfig,
            searchAttributes: {
                ...prevConfig.searchAttributes,
                [name]: {
                ...prevConfig.searchAttributes[name],
                sort: val
                }
            }
        }));
    };

    const activeAttributes = Object.keys(searchAttributes)
        .filter(key => searchAttributes[key].isActive)
        .map(activeKey => (
            <Flex key={activeKey} justifyContent="space-between" alignItems="center" marginVertical="large">
				<FlexItem>
					<Text key={activeKey}>{activeKey}</Text>
				</FlexItem>
				<FlexItem>
                <Select
                    maxHeight={300}
                    onOptionChange={(val)=>handleSortChange(val,activeKey)}
                    options={[
                        { value: 'Ordered', content: 'Ordered' },
                        { value: 'Unordered', content: 'Unordered' },
                    ]}
                    placeholder="Choose Searchable Attributes"
                    placement="bottom-start"
                    required
                    value={searchAttributes[activeKey].sort}
                />
				</FlexItem>
            </Flex>
        ));
    return (
        <Box marginLeft='xxxLarge'>
            <Box marginBottom="xxLarge" >
                <H2>Searchable Attributes</H2>
                {/* <Small>Set the number of search results per page</Small>
                <Small>Default: 20</Small> */}
            </Box>
            {activeAttributes}
            <Form fullWidth marginTop="large">
                <FormGroup>
                    <MultiSelect
                    filterable={true}
                    label="Searchable Attributes"
                    maxHeight={300}
                    onOptionsChange={handleChange}
                    options={[
                        { value: 'sku', content: 'sku' },
                        { value: 'parentSku', content: 'parentSku' },
                        { value: 'name', content: 'name' },
                        { value: 'options.value', content: 'options.value' },
                        { value: 'description', content: 'description' },
                        { value: 'categories', content: 'categories' }
                    ]}
                    placeholder="Choose country"
                    placement="bottom-start"
                    required
                    value={value}
                    />
                </FormGroup>
            </Form>
        </Box>
    )
};

export default SearchAttributes;
