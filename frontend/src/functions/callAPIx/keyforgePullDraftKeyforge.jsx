const fetchDraftKeyforge = async (slug) => {
        try {
        const res = await fetch(`/api/keyforge/draftKeyforge/${slug}`);
        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        return data;
        } catch (err) {
        console.error('Erreur fetch article:', err);
        return null;
        }
    };

export default fetchDraftKeyforge;