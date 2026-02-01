interface AvatarProps {
    name?: string | null;
    shopName?: string | null;
    role?: string;
}

const getInitials = (name: string | null | undefined): string => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
};

export const UserAvatar = ({ name, shopName, role }: AvatarProps) => {
    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 60%, 50%)`;
    };

    const displayName = role === "artisan" && shopName ? shopName : name;
    const initials = getInitials(displayName);

    return (
        <div className="avatar-circle">
            {initials}

            <style jsx>{`
        .avatar-circle {
          width: 6rem;
          height: 6rem;
          background-color: ${stringToColor(displayName || "")};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: bold;
          font-size: 3rem;
          text-transform: uppercase;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
};