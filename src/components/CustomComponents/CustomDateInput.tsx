import { DateInput, DateInputProps } from "@mantine/dates";

type Props = DateInputProps;

const CustomDateInput = ({ ...props }: Props) => {
    return (
        <DateInput
            {...props}
            labelProps={{
                className: "text-mantine-checkbox-label dark:text-mantine-checkbox-label-dark",
            }}
        />
    );
};

export default CustomDateInput;
