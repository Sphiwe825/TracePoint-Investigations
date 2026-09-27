export async function getEvidence(){
    try{
        const res = await fetch("/api/evidence",{
            method: 'GET'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to get evidence")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function saveEvidence(payload){
    try{
        const res = await fetch("/api/evidence",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to save evidence")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function updateEvidence(id, payload){
    try{
        const res = await fetch(`/api/evidence/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to update evidence")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function deleteEvidence(id){
    try{
        const res = await fetch(`/api/evidence/${id}`,{
            method: 'DELETE'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to delete evidence")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}
