type CreateAccountProps = {
    redirect?: string;
    action: (payload: FormData) => void;
    pending: boolean;
};

export const CreateAccount = ({ action, pending, redirect }: CreateAccountProps) => {
    return (
        <form action={action}>
            <input name="redirect" type="hidden" value={redirect || '/'} />

            <div className="input-group rounded-t-2xl w-full">
                <label className="input-label">Email</label>
                <input name="email" type="email" placeholder="batman@notbrucewayne.com" className="input-field" />
            </div>
            <div className="input-group  w-full">
                <label className="input-label">First name</label>
                <input name="firstname" placeholder="Bruce" className="input-field" />
            </div>
            <div className="input-group rounded-b-2xl border-b w-full">
                <label className="input-label">Surname</label>
                <input name="surname" placeholder="Wayne" className="input-field" />
            </div>
            <button
                type="submit"
                className="px-8 mt-6 ml-auto mr-0 py-3 block bg-black text-white font-bold rounded-lg "
                disabled={pending}
            >
                Register
            </button>
        </form>
    );
};
