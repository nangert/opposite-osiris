import CustomButton from "@components/CustomComponents/CustomButton";
import CustomDateInput from "@components/CustomComponents/CustomDateInput";
import CustomTextarea from "@components/CustomComponents/CustomTextBox";
import { useState } from "react";
import "./EventCreator.css";
import CustomTextInput from "@components/CustomComponents/CustomTextInput";
import CustomTimeInput from "@components/CustomComponents/CustomTimeInput";

//ChangeImport
//import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
//import { createClient } from "@supabase/supabase-js";

const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
const supabase = createClient(dbUrl, anonKey);

const EventCreator = () => {
    const [title, setTitle] = useState("");

    const handleTitle = (event: any) => {
        setTitle(event.target.value);
    };

    const [bodyText, setBodyText] = useState("");

    const handleBodyText = (event: any) => {
        setBodyText(event.target.value);
    };

    const [footerText, setFooterText] = useState("");

    const handleFooterText = (event: any) => {
        setFooterText(event.target.value);
    };

    const [link, setLink] = useState("");

    const handleLink = (event: any) => {
        setLink(event.target.value);
    };

    const [fileLink, setFileLink] = useState("");

    const handleFileLink = (event: any) => {
        setFileLink(event.target.value);
    };

    const [date, setDate] = useState<Date | null>(null);

    const [time, setTime] = useState("");

    const handleTime = (event: any) => {
        setTime(event.target.value);
    };

    const saveEvent = async (event: object) => {
        return await supabase.from("Event").insert(event);
    };

    const handleClick = () => {
        const event = {
            title: title,
            body: bodyText,
            footer: footerText,
            link: link,
            date: date,
            time: time,
            fileLink: fileLink,
        };

        saveEvent(event);
    };

    return (
        <>
            <div className="Header">Create event:</div>
            <div className="form">
                <div className="formItem">
                    <CustomTextInput label="Title" onChange={handleTitle} value={title} />
                </div>
                <div className="formItem">
                    <CustomTextarea label="Body text" onChange={handleBodyText} value={bodyText} />
                </div>
                <div className="formItem">
                    <CustomTextarea label="Footer text" onChange={handleFooterText} value={footerText} />
                </div>
                <div className="formItem">
                    <CustomTextInput label="Link" onChange={handleLink} value={link} />
                </div>
                <div className="formItem">
                    <div className="dateTime">
                        <div className="time">
                            <CustomDateInput label="Date" onChange={setDate} value={date} />
                        </div>
                        <div className="time">
                            <CustomTimeInput label="Time in UTC" onChange={handleTime} value={time} />
                        </div>
                    </div>
                </div>
                <div className="formItem">
                    <CustomTextInput label="Graphic (This doesnt work yet)" onChange={handleFileLink} value={fileLink} />
                </div>
                <div className="formItem">
                    <CustomButton onClick={handleClick}>Submit</CustomButton>
                </div>
            </div>
        </>
    );
};

export default EventCreator;
