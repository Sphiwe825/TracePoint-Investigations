export async function getSuspects(){
    try{
        const res = await fetch("/api/suspect",{
            method: 'GET'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to get suspects")
        }

        const data = await res.json()

        return data.map((suspect) => ({
            id: suspect.suspectId ?? suspect.SuspectId ?? suspect.id,
            name: suspect.name ?? suspect.Name ?? '',
            occupation: suspect.occupation ?? suspect.Occupation ?? '',
            description: suspect.description ?? suspect.Description ?? ''
        }))
    }catch(e){
        console.error(e)
        return []
    }
}

export async function saveSuspect(payload){
    try{
        const res = await fetch("/api/suspect",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to save suspect")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function updateSuspect(id, payload){
    try{
        const res = await fetch(`/api/suspect/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to update suspect")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function deleteSuspect(id){
    try{
        const res = await fetch(`/api/suspect/${id}`,{
            method: 'DELETE'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to delete suspect")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}
