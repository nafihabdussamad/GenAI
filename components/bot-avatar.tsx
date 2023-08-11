import { Avatar, AvatarImage } from "./ui/avatar";

export default function BotAvatar(){

    return (
        <Avatar className="h-6 w-6">
            <AvatarImage className="p-1" src="/logo.png" />
        </Avatar>
    )
}