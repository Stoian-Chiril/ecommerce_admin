"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import React from "react";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
    entityName: string;
    entityidName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityidName,
}) => {
    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/stores/${params.storeId}`

    return (
        <>
            <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityidName}}`}
            />
            <ApiAlert 
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityidName}}`}
            />
            <ApiAlert 
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityidName}}`}
            />
        </>
    )
}