export async function getInvestigations(){
    try{
        const res = await fetch("/api/investigation",{
            method: 'GET'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to get investigations")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function saveInvestigation(payload){
    try{
        const res = await fetch("/api/investigation",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to save investigation")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function updateInvestigation(id, payload){
    try{
        const res = await fetch(`/api/investigation/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to update investigation")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function deleteInvestigation(id){
    try{
        const res = await fetch(`/api/investigation/${id}`,{
            method: 'DELETE'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to delete investigation")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}
