import { useEffect, useState } from "react";
import Event from "./Event";
import "./EventRoot.css";

//ChangeImport
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
//import { createClient } from "@supabase/supabase-js";

const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
const supabase = createClient(dbUrl, anonKey);

type Event = {
    title: string;
    body: string;
    footer: string;
    link: string;
    date: string;
    time: string;
    fileLink: string;
};

const EventsRoot = () => {
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        const { data, error } = await supabase.from("Event").select("title, body, footer, link, date, time, fileLink");
        data ? setEvents(data) : setEvents([]);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="EventRoot">
            <div className="Header">Events:</div>
            <ul>
                {events.map(item => (
                    <Event title={item.title} date={item.date} time={item.time} body={item.body} footer={item.footer} link={item.link} />
                ))}
            </ul>
        </div>
    );
};

export default EventsRoot;
