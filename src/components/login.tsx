type LoginProps = {
    redirect?: string;
    action: (payload: FormData) => void;
    pending: boolean;
};
export const Login = ({ redirect, action, pending }: LoginProps) => {
    return (
        <form action={action}>
            <div className="input-group rounded-2xl border w-full">
                <label className="input-label">Email</label>
                <input name="email" type="email" placeholder="batman@notbrucewayne.com" className="input-field" />
                <input name="redirect" type="hidden" value={redirect || '/'} />
            </div>

            <button
                type="submit"
                className="px-8 mt-6 block ml-auto mr-0  py-3 bg-black text-white font-bold  rounded-lg "
                disabled={pending}
            >
                Login
            </button>
        </form>
    );
};
