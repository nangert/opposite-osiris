import { Button, ButtonProps } from "@mantine/core";

type Props = ButtonProps & { onClick?: () => void; id?: string };

const CustomButton = ({ onClick, id, ...props }: Props) => {
    return (
        <div className="flex items-center">
            <Button
                id={id}
                onClick={onClick}
                {...props}
                className="bg-mantine-button dark:bg-mantine-button-dark dark:hover:bg-mantine-button-dark-hover text-mantine-button-text hover:bg-mantine-button-hover dark:text-mantine-button-text-dark"
            />
        </div>
    );
};

export default CustomButton;
