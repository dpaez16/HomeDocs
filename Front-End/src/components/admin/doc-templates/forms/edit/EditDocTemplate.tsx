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
        <Tabs
            defaultValue={EditDocTemplateTabs.General}
            value={tab}
            onValueChange={(v) => setTab(v as EditDocTemplateTabs)}
            className='h-full'
        >
            <div className='flex flex-col gap-4 h-full'>
                <TabsList defaultValue={defaultTab}>
                    <TabsTrigger value={EditDocTemplateTabs.General}>General</TabsTrigger>
                    <TabsTrigger value={EditDocTemplateTabs.AssociatedFileTypes}>Associated File Types</TabsTrigger>
                </TabsList>
                <div className='h-full'>
                    <TabsContent value={EditDocTemplateTabs.General} className='h-full'>
                        <EditDocTemplateGeneralForm
                            docTemplateID={props.docTemplateID}
                        />
                    </TabsContent>
                    <TabsContent value={EditDocTemplateTabs.AssociatedFileTypes} className='h-full'>
                        <AssociatedFileTypesForm
                            docTemplateID={props.docTemplateID}
                        />
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    );
};
