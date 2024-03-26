document.addEventListener("DOMContentLoaded", function() {
    const storage = firebase.storage();
    const storageRef = storage.ref(); // Reference to storage root

    const specifiedWeek = "2"; 
    ////////THIS IS THE WEEK!!! CHANGE HERE!!!!! 

    const listAllFiles = async () => {
        const prefixes = ['cup', 'fre', 'mil'];
        const week = 2;

        storageRef.listAll().then((result) => {
            result.items.forEach((audioRef) => {
                // Check the prefix of each file to categorize it and display accordingly
                prefixes.forEach(prefix => {
                    if (audioRef.name.toLowerCase().startsWith(prefix)) {
                        displayAudio(audioRef, `${prefix.toLowerCase()}List`);
                    }
                });
            });
        }).catch((error) => {
            console.log("Error listing files: ", error);
        });
    };

    const displayAudio = (audioRef, listId) => {
        audioRef.getDownloadURL().then((url) => {
            // Extract the week number from the file name
            const weekMatch = audioRef.name.match(/week (\d+)/);
            const fileWeek = weekMatch ? weekMatch[1] : null;
    
            // Check if the extracted week matches the specified week variable

            if(fileWeek === specifiedWeek) {
                const list = document.getElementById(listId);
                const listItem = document.createElement('li');
                
                const audioTable = document.createElement('div');
                audioTable.className = 'audio-table';
        
                const audioPlayer = document.createElement('audio');
                audioPlayer.controls = true;
                const source = document.createElement('source');
                source.src = url;
                source.type = 'audio/mpeg';
                audioPlayer.appendChild(source);
                
                // Extract name and optionally other details from the audioRef.name
                const nameMatch = audioRef.name.match(/_(.*?)_week/); // Adjusted to stop before "_week"
                const fileName = nameMatch ? nameMatch[1].trim() : "Unknown"; // Default to "Unknown" if no match
    
                const audioName = document.createElement('span');
                audioName.className = 'audio-name';
                audioName.textContent = fileName; // Display extracted name
                
                audioTable.appendChild(audioPlayer);
                audioTable.appendChild(audioName);
                listItem.appendChild(audioTable);
                list.appendChild(listItem);
            }
        }).catch((error) => {
            console.log("Error getting file URL: ", error);
        });
    };
    
    

    listAllFiles(); // Call the function on page load
});
