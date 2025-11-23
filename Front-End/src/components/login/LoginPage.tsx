import { useForm } from "@/hooks/useForm";

export const LoginPage = () => {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async (formData) => {
            return;
        },
    });

    return <p>TODO</p>;
};
