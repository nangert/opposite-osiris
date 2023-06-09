import { Card, Image, Text } from "@mantine/core";
import "./EventRoot.css";
import dayjs from "dayjs";

interface EventProps {
    title: string;
    date: string;
    time: string;
    body: string;
    footer: string;
    fileLink: string;
    link: string;
}

const Event = ({ title, date, time, body, footer, link, fileLink }: EventProps) => {
    console.log(body);
    return (
        <Card shadow="sm" padding="xl" component="a" href={link} target="_blank" className="Event">
            <Card.Section>
                <Image src={fileLink} height={160} alt="No way!" />
            </Card.Section>
            <Text>
                <div className="Title">
                    <div>{title}</div>
                    {date && (
                        <div>
                            {dayjs(date).format("YYYY/MM/DD")}
                            {time && <div>{time} UTC</div>}
                        </div>
                    )}
                </div>
            </Text>

            <Text>{body}</Text>

            <Card.Section className="Footer">{footer}</Card.Section>
        </Card>
    );
};

export default Event;
