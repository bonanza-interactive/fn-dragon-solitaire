export function showPopup(s: string) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.textAlign = 'center';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%,-50%)';
  popup.style.borderRadius = '4px';
  popup.style.backgroundColor = 'tomato';
  popup.style.padding = '1rem';
  popup.style.color = 'rgba(255, 255, 255, 0.87)';
  popup.innerHTML = '<p>' + s + '</p>';
  document.documentElement.appendChild(popup);
}
