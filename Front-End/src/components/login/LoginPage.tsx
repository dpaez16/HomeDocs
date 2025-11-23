import { useForm } from "@/hooks/useForm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { loginUser } from "@/api/loginSession";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserSession } from "@/types/userSession";

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
            loginUser(email, password)
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
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form className='flex flex-col gap-6'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            value={form.formData.email}
                            onChange={(e) => form.setFormValue('email', e.target.value)}
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
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
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex-col gap-2'>
                <Button type='button' className='w-full' disabled={!form.isValid || !form.isDirty || form.isSubmitting} onClick={() => form.submit()}>
                    {form.isSubmitting ? <Spinner /> : 'Login'}
                </Button>
                <Button variant='outline' className='w-full' disabled={form.isSubmitting}>
                    Sign Up
                </Button>
            </CardFooter>
        </Card>
    );
};
