const postPlayers = async () => {
    const allPlayersJson = await fetchallplayers();
    const allPlayers = allPlayersJson.data;

    const rows = matches.map(
        match =>
            ({
                username: match.opponent_username,
                user_id: match.opponent_id,
            })
    );

    const uniqueData = rows.reduce((uniqueList, item) => {
        const isDuplicate = uniqueList.some(uniqueItem => uniqueItem.username === item.username);

        if (!isDuplicate) {
            uniqueList.push(item);
        }

        return uniqueList;
    }, []);

    const newData = uniqueData.filter(item => {
        return !allPlayers.some(allPlayer => allPlayer.username === item.username);
    });

    const { error } = await supabase.from("players").insert(newData);
    if (error) {
        console.log(error);
    }
};