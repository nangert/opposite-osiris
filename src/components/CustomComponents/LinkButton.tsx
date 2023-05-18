interface LinkButtonInputProps {
    href: string;
    children?: React.ReactNode;
}

const CustomLinkButton = ({ href, children }: LinkButtonInputProps) => {
    return (
        <a className="hover:text-skin-accent" type="button" href={href}>
            {children}
        </a>
    );
};

export default CustomLinkButton;
