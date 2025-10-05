import type { ReactNode } from "react";
import './additionalcss.css'
import { Link } from "@tanstack/react-router";

interface ProfileOptionProps {
    icon: ReactNode;
    text: string;
    link?: string;
    onClick?: () => void;
  }

  export default function ProfileOption({ icon, text, link, onClick }: ProfileOptionProps) {
    const content = (
      <div className="profile-option" onClick={onClick}>
        <span className="text-xl">{icon}</span>
        <span className="text-xl pl-4 font-medium">{text}</span>
      </div>
    );
  
    return (
      <>
        {link ? (
          <Link to={link}>{content}</Link>
        ) : (
          content
        )}
        <hr />
      </>
    );
  }