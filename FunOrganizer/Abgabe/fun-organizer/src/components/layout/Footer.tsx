import { Link } from '@tanstack/react-router';
import './Footer.css';
import { Home, User, CalendarDays } from "lucide-react";

export const Footer = () => {
    return (
        <footer>

            <Link
                to="/events/events"
                className="footerlink"
                activeProps={{
                className: "footerlink activefooterlink",
                }}
            >
                <CalendarDays size={30} />
                <span>My Events</span>
            </Link>

            <Link
                to="/dashboard"
                className="footerlink"
                activeProps={{
                className: "footerlink activefooterlink",
                }}
            >
                <Home size={30} />
                <span>Dashboard</span>
            </Link>

            <Link
                to="/user/profile"
                className="footerlink"
                activeProps={{
                className: "footerlink activefooterlink",
                }}
            >
                <User size={30} />
                <span>Profile</span>
            </Link>

        </footer>
    );
};
