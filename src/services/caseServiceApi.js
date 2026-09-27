export async function getCase(){
    try{
        const res = await fetch("/api/case",{
            method: 'GET'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to get case")
        }

        const data = await res.json()
        const item = Array.isArray(data) ? data[0] : data

        if(!item) return null

        return {
            id: item.caseId,
            name: item.caseName,
            description: item.description,
            status: item.status
        }
    }catch(e){
        console.error(e)
        return null
    }
}

export async function saveCase(payload){
    try{
        const body = {
            caseName: payload.caseName ?? payload.name,
            description: payload.description,
            status: payload.status
        }

        const res = await fetch("/api/case",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to save case")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function updateCase(id, payload){
    try{
        const body = {
            caseName: payload.caseName ?? payload.name,
            description: payload.description,
            status: payload.status
        }

        const res = await fetch(`/api/case/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to update case")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

export async function deleteCase(id){
    try{
        const res = await fetch(`/api/case/${id}`,{
            method: 'DELETE'
        })

        if(!res.ok){
            throw new Error(await res.text() || "Failed to delete case")
        }

        return res.json()
    }catch(e){
        console.error(e)
    }
}

