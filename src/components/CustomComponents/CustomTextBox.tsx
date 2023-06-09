import { TextInput, TextInputProps, Textarea, TextareaProps } from "@mantine/core";

type Props = TextareaProps;

const CustomTextarea = ({ ...props }: Props) => {
    return (
        <Textarea
            {...props}
            labelProps={{
                className: "text-mantine-checkbox-label dark:text-mantine-checkbox-label-dark",
            }}
        />
    );
};

export default CustomTextarea;
