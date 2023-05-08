import { TextInput, TextInputProps } from "@mantine/core";

type Props = TextInputProps;

const CustomTextInput = ({ ...props }: Props) => {
    return (
        <TextInput
            {...props}
            labelProps={{
                className: "text-mantine-checkbox-label dark:text-mantine-checkbox-label-dark",
            }}
        />
    );
};

export default CustomTextInput;
