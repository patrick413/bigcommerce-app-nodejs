import { Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Textarea, MultiSelect, createAlertsManager, AlertProps, AlertsManager  } from '@bigcommerce/big-design';
import { DeleteIcon } from '@bigcommerce/big-design-icons';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FormData } from '../types';

interface FormProps {
    formData: FormData;
    onCancel(): void;
    onSubmit(form: FormData): void;
    isLoading: boolean;
}

const FormErrors = {
    name: 'Product name is required',
    price: 'Default price is required',
};
const categoriesOptions = [
    { value: 'Hose', content: 'Hose' },
    { value: 'PVC Hose - Water', content: 'PVC Hose - Water' },
    { value: 'PVC Wire Suction Hose', content: 'PVC Wire Suction Hose' },
    { value: 'Tubing', content: 'Tubing' },
    { value: 'PVC Tubing', content: 'PVC Tubing' },
    { value: 'Miscellaneous', content: 'Miscellaneous' },
    { value: 'Hose & Tubing Cutters', content: 'Hose & Tubing Cutters' },
    { value: 'PVC lvl2 test', content: 'PVC lvl2 test' },
    { value: 'Couplings', content: 'Couplings' },
]
const categorieslvl0Options = [
    { value: 'Hose', content: 'Hose' },
    { value: 'Tubing', content: 'Tubing' },
    { value: 'Couplings', content: 'Couplings' },
    { value: 'Fittings', content: 'Fittings' },
    { value: 'Clamps', content: 'Clamps' },
    { value: 'Valves', content: 'Valves' },
    { value: 'Miscellaneous', content: 'Miscellaneous' },
    { value: 'Portable Exchange & DI', content: 'Portable Exchange & DI' },
]
const categorieslvl1Options = [
    { value: 'Hose > PVC Hose - Water', content: 'Hose > PVC Hose - Water' },
    { value: 'Hose > PVC Wire Suction Hose', content: 'Hose > PVC Wire Suction Hose' },
    { value: 'Tubing > PVC Tubing', content: 'Tubing > PVC Tubing' },
    { value: 'Miscellaneous > Hose & Tubing Cutters', content: 'Miscellaneous > Hose & Tubing Cutters' },
]
const alertsManager = createAlertsManager()
const Form = ({ formData, onCancel, onSubmit, isLoading }: FormProps) => {
    const { description, name, sku, parentSku, productUrl,categories, searchKeyword } = formData;
    const [form, setForm] = useState<FormData>({ description, sku, name, parentSku, productUrl, categories,"categories.lvl0": formData["categories.lvl0"],"categories.lvl1": formData["categories.lvl1"],"categories.lvl2": formData["categories.lvl2"],"categories.lvl3": formData["categories.lvl3"], searchKeyword });
    // const [errors, setErrors] = useState<StringKeyValue>({});

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event.target || {};
        setForm(prevForm => ({ ...prevForm, [formName]: value }));

        // Add error if it exists in FormErrors and the input is empty, otherwise remove from errors
        // !value && FormErrors[formName]
        //     ? setErrors(prevErrors => ({ ...prevErrors, [formName]: FormErrors[formName] }))
        //     : setErrors(({ [formName]: removed, ...prevErrors }) => ({ ...prevErrors }));
    };
    const handleSelectChange = (selected: string[], name: string) => {
        setForm(prevForm => ({ ...prevForm, [name]: selected }));
    };
    const alert: AlertProps = {
        header: 'Document Updated',
        messages: [
        {
            text: form.name,
            },
        ],
        type: 'success',
        
        onClose: () => null,
    };
    
    const handleSubmit = (event: FormEvent<EventTarget>) => {
        event.preventDefault();
        // If there are errors, do not submit the form
        // const hasErrors = Object.keys(errors).length > 0;
        // if (hasErrors) return;
        onSubmit(form);
        alertsManager.add(alert);
        setTimeout(() => {
            alertsManager.clear();
        }, 4000);
    };

    return (
        <StyledForm onSubmit={handleSubmit} fullWidth>
            <AlertsManager manager={alertsManager} />
            <Panel header="Basic Information">
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="Name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="SKU"
                        name="sku"
                        required
                        value={form.sku}
                        onChange={handleChange}
                    />
                     <Input
                        // error={errors?.name}
                        label="Parent SKU"
                        name="parentSku"
                        required
                        value={form.parentSku}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="Product URL"
                        name="productUrl"
                        required
                        value={form.productUrl}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="Search Keyword"
                        name="searchKeyword"
                        value={form.searchKeyword}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <MultiSelect
                        filterable={true}
                        label="Categories"
                        maxHeight={300}
                        onOptionsChange={selected => handleSelectChange(selected, 'categories')}
                        options={categoriesOptions}
                        placeholder="Choose category"
                        placement="bottom-start"
                        required
                        name='categories'
                        value={form.categories}
                    />
                </FormGroup>
                <FormGroup>
                    <MultiSelect
                        filterable={true}
                        label="Categories Level 0"
                        maxHeight={300}
                        onOptionsChange={selected => handleSelectChange(selected, 'categories.lvl0')}
                        options={categorieslvl0Options}
                        placeholder="Choose category"
                        placement="bottom-start"
                        required
                        name='categories'
                        value={form['categories.lvl0']}
                    />
                    <MultiSelect
                        filterable={true}
                        label="Categories Level 1"
                        maxHeight={300}
                        onOptionsChange={selected => handleSelectChange(selected, 'categories.lvl1')}
                        options={categorieslvl1Options}
                        placeholder="Choose category"
                        placement="bottom-start"
                        name='categories'
                        value={form['categories.lvl1']}
                    />
                    <MultiSelect
                        filterable={true}
                        label="Categories Level 2"
                        maxHeight={300}
                        onOptionsChange={selected => handleSelectChange(selected, 'categories.lvl2')}
                        options={categorieslvl1Options}
                        placeholder="Choose category"
                        placement="bottom-start"
                        name='categories'
                        value={form['categories.lvl2']}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="Image URL"
                        name="imageSrc"
                        // value={form.name}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        // error={errors?.name}
                        label="Image Alt"
                        name="imageAlt"
                        // value={form.name}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    {/* Using description for demo purposes. Consider using a wysiwig instead (e.g. TinyMCE) */}
                    <Textarea
                        label="Description"
                        name="description"
                        placeholder="Product info"
                        value={form.description}
                        onChange={handleChange}
                    />
                </FormGroup>
                <Flex justifyContent="flex-end">
                <Button
                    marginRight="medium"
                    type="button"
                    variant="subtle"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                    <Button type="submit" isLoading={isLoading}>Save</Button>
            </Flex>
            </Panel>
            
        </StyledForm>
    );
};

export default Form;
