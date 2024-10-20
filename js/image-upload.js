let selectedFiles = [];

// Function to update image preview
function updateImagePreview() {
    const container = document.getElementById('image-preview-container');
    container.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);

        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            selectedFiles = selectedFiles.filter((_, i) => i !== index);
            updateImagePreview();
        };

        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        container.appendChild(previewItem);
    });
}

// Handle image upload
document.getElementById('image-upload').addEventListener('change', function (event) {
    const files = Array.from(event.target.files);
    selectedFiles = selectedFiles.concat(files);
    updateImagePreview();
    this.value = ''; // Reset input
});