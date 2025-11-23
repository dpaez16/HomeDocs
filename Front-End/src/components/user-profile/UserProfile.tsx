import { fetchUser } from "@/api/users";
import { LoginSessionContext } from "@/context/LoginSessionContext";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { useContext } from "react";
import { Spinner } from "@/components/ui/spinner";
import { constructFullName } from "@/utils/users";
import { PageTitle } from "@/components/ui/page/page-title";
import { PageContainer } from "@/components/ui/page/page-container";
import { useForm } from "@/hooks/useForm";
import { validateEmail } from "@/utils/validators";
import { FormSection } from "../ui/form/form-section";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { addRight, hasRight, removeRight, Rights } from "@/utils/rights";
import { Checkbox } from "../ui/checkbox";

export const UserProfile = () => {
    const { userSession } = useContext(LoginSessionContext);
    const userID = userSession!.user.userID;
    const jwt = userSession!.jwt;

    const { data: user, loading, error } = useDataFetcher(() => fetchUser(userID, jwt));
    const isAdmin = hasRight(user?.rights ?? 0, Rights.Admin);

    const form = useForm({
        defaultValues: {
            email: user?.email ?? '',
            firstName: user?.firstName ?? '',
            middleInitials: user?.middleInitials ?? '',
            lastName: user?.lastName ?? '',
            rights: user?.rights ?? 0,
        },
        validator: (formData) => {
            return (
                validateEmail(formData.email) &&
                !!formData.firstName
            );
        },
        onSubmit: async (formData) => {
            console.log(formData);
        },
    });

    if (loading) {
        return <Spinner />;
    }

    if (!user) {
        return (
            <div>
                <p>Unable to load user</p>
                {error && <p>{error.message}</p>}
            </div>
        );
    }

    return (
        <PageContainer className='flex flex-col gap-10'>
            <PageTitle>{constructFullName(user, 'firstLast')}</PageTitle>
            <form className='flex flex-col gap-6'>
                <FormSection>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                        id='firstName'
                        type='text'
                        value={form.formData.firstName}
                        onChange={(e) => form.setFormValue('firstName', e.target.value)}
                        required
                    />
                </FormSection>
                <FormSection>
                    <Label htmlFor='middleInitials'>Middle Initials</Label>
                    <Input
                        id='middleInitials'
                        type='text'
                        value={form.formData.middleInitials}
                        onChange={(e) => form.setFormValue('middleInitials', e.target.value)}
                        required
                    />
                </FormSection>
                <FormSection>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                        id='lastName'
                        type='text'
                        value={form.formData.lastName}
                        onChange={(e) => form.setFormValue('lastName', e.target.value)}
                        required
                    />
                </FormSection>
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
                {
                    isAdmin &&
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-3'>
                            <Checkbox
                                id='reader'
                                checked={hasRight(form.formData.rights, Rights.Reader)}
                                onCheckedChange={(checkedState) => {
                                    const isChecked = !!checkedState.valueOf();
                                    if (isChecked) {
                                        form.setFormValue('rights', addRight(form.formData.rights, Rights.Reader));
                                    } else {
                                        form.setFormValue('rights', removeRight(form.formData.rights, Rights.Reader));
                                    }
                                }}
                            />
                            <Label htmlFor='reader'>Reader</Label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Checkbox
                                id='author'
                                checked={hasRight(form.formData.rights, Rights.Author)}
                                onCheckedChange={(checkedState) => {
                                    const isChecked = !!checkedState.valueOf();
                                    if (isChecked) {
                                        form.setFormValue('rights', addRight(form.formData.rights, Rights.Author));
                                    } else {
                                        form.setFormValue('rights', removeRight(form.formData.rights, Rights.Author));
                                    }
                                }}
                            />
                            <Label htmlFor='author'>Author</Label>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Checkbox
                                id='admin'
                                checked={hasRight(form.formData.rights, Rights.Admin)}
                                onCheckedChange={(checkedState) => {
                                    const isChecked = !!checkedState.valueOf();
                                    if (isChecked) {
                                        form.setFormValue('rights', addRight(form.formData.rights, Rights.Admin));
                                    } else {
                                        form.setFormValue('rights', removeRight(form.formData.rights, Rights.Admin));
                                    }
                                }}
                            />
                            <Label htmlFor='admin'>Administrator</Label>
                        </div>
                    </div>
                }
                </FormSection>
            </form>
        </PageContainer>
    );
};
