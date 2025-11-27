import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { EditDocTemplateGeneralForm } from "./EditDocTemplateGeneralForm";
import { AssociatedFileTypesForm } from "./AssociatedFileTypesForm";

interface EditDocTemplateProps {
    docTemplateID: number;
}

enum EditDocTemplateTabs {
    General = 'general',
    AssociatedFileTypes = 'AssociatedFileTypes',
}

export const EditDocTemplate: React.FC<EditDocTemplateProps> = (props) => {
    const [tab, setTab] = useState<EditDocTemplateTabs | undefined>(EditDocTemplateTabs.General);
    const defaultTab = EditDocTemplateTabs.General;

    return (
        <Tabs defaultValue={EditDocTemplateTabs.General} value={tab} onValueChange={(v) => setTab(v as EditDocTemplateTabs)} className='mt-3'>
            <TabsList defaultValue={defaultTab}>
                <TabsTrigger value={EditDocTemplateTabs.General}>General</TabsTrigger>
                <TabsTrigger value={EditDocTemplateTabs.AssociatedFileTypes}>Associated File Types</TabsTrigger>
            </TabsList>
            <TabsContent value={EditDocTemplateTabs.General}>
                <EditDocTemplateGeneralForm
                    docTemplateID={props.docTemplateID}
                />
            </TabsContent>
            <TabsContent value={EditDocTemplateTabs.AssociatedFileTypes}>
                <AssociatedFileTypesForm
                    docTemplateID={props.docTemplateID}
                />
            </TabsContent>
        </Tabs>
    );
};
