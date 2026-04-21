import SuccessIcon from "../../assets/icons/success.svg?react";
import { useLocation } from "react-router-dom";

const PostRegisterEmailVerify = () => {
    const location = useLocation();
    const data = location.state;

    return (
        <div className="flex flex-1 w-full flex items-center justify-center font-UberMove ">
            <div className="flex flex-col items-center gap-10">
                <SuccessIcon className="w-20" />
                <p className="text-center">Un email a été envoyé à <span className="font-semibold">{data?.email}</span>.</p>
                <p className="text-center">Vous ne pouvez pas accéder a Primo, si vous n'avez pas vérifié votre adresse e-mail.</p>
            </div>
        </div>
    )
}

export default PostRegisterEmailVerify;