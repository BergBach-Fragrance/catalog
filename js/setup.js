// setup.js - Script para aplicar la configuración al HTML
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el título de la página
    document.getElementById('site-title').textContent = `${tiendaConfig.sitio.nombre} - ${tiendaConfig.sitio.descripcion}`;
    
    // Configurar el encabezado
    document.getElementById('header-title').textContent = tiendaConfig.sitio.nombreCorto;
    document.getElementById('header-subtitle').textContent = tiendaConfig.sitio.subtitulo;
    
    // Configurar el campo de búsqueda
    document.getElementById('search-input').placeholder = tiendaConfig.busqueda.placeholder;
    
    // Configurar los filtros
    const brandFilter = document.getElementById('brand-filter');
    brandFilter.innerHTML = '<option value="">Todas las marcas</option>';
    tiendaConfig.busqueda.filtros.marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca.valor;
        option.textContent = marca.texto;
        brandFilter.appendChild(option);
    });
    
    const typeFilter = document.getElementById('type-filter');
    typeFilter.innerHTML = '<option value="">Todos los generos</option>';
    tiendaConfig.busqueda.filtros.generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.valor;
        option.textContent = genero.texto;
        typeFilter.appendChild(option);
    });
    
    const sortFilter = document.getElementById('sort-filter');
    sortFilter.innerHTML = '';
    tiendaConfig.busqueda.filtros.ordenamiento.forEach(orden => {
        const option = document.createElement('option');
        option.value = orden.valor;
        option.textContent = orden.texto;
        sortFilter.appendChild(option);
    });
    
    // Configurar el footer
    document.getElementById('footer-title').textContent = tiendaConfig.footer.titulo;
    document.getElementById('footer-description').textContent = tiendaConfig.footer.descripcion;
    
    // Configurar los enlaces sociales
    const socialLinksContainer = document.getElementById('social-links-container');
    socialLinksContainer.innerHTML = '';
    tiendaConfig.footer.socialLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        const i = document.createElement('i');
        i.className = `fab fa-${link.plataforma}`;
        a.appendChild(i);
        socialLinksContainer.appendChild(a);
    });
    
    // Configurar el copyright
    document.getElementById('copyright').textContent = `© ${tiendaConfig.sitio.copyright}`;
});