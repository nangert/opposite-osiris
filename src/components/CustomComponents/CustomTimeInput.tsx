import { TimeInput, TimeInputProps } from "@mantine/dates";
type Props = TimeInputProps;

const CustomTimeInput = ({ ...props }: Props) => {
    return (
        <TimeInput
            {...props}
            labelProps={{
                className: "text-mantine-checkbox-label dark:text-mantine-checkbox-label-dark",
            }}
        />
    );
};

export default CustomTimeInput;
