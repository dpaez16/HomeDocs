import { useForm } from "@/hooks/useForm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { loginUser } from "@/api/loginSession";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserSession } from "@/types/userSession";
import { ComputerIcon } from "lucide-react";
import { FormSection } from "@/components/ui/form/form-section";
import { SubmitButton } from "../ui/form/submit-button";

export const LoginPage = () => {
    const { setLocalStorageValue: setUserSession } = useLocalStorage<UserSession>('userSession');

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validator: (formData) => !!formData.email && !!formData.password,
        onSubmit: async (formData) => {
            const { email, password } = formData;
            await loginUser(email, password)
                .then(userSession => {
                    setUserSession(userSession);
                    window.location.href = '/';
                })
                .catch(err => {
                    alert(`Could not log in: ${err.message}`);
                });
        },
    });

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='flex justify-center items-center'>
                    {/* TODO: Use HomeDocs icon */}
                    <ComputerIcon />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className='flex flex-col gap-6'>
                    <FormSection>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            value={form.formData.email}
                            onChange={(e) => form.setFormValue('email', e.target.value)}
                            required
                        />
                    </FormSection>
                    <FormSection>
                        <div className='flex items-center'>
                            <Label htmlFor='password'>Password</Label>
                            <a
                                href='#'
                                className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id='password'
                            type='password'
                            value={form.formData.password}
                            onChange={(e) => form.setFormValue('password', e.target.value)}
                            required
                        />
                    </FormSection>
                </form>
            </CardContent>
            <CardFooter className='flex-col gap-2'>
                <SubmitButton form={form} className='w-full'>
                    Login
                </SubmitButton>
                <Button variant='outline' className='w-full' disabled={form.isSubmitting}>
                    Sign Up
                </Button>
            </CardFooter>
        </Card>
    );
};
