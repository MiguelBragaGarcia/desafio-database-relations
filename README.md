# Desafio gerenciador de stock genérico

Essa é uma aplicação de controle de stock feita de acordo com as [instruções do desafio](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-relations) , tendo o propósito de exercitar e consolidar os conhecimentos de banco de dados utilizando a ferramenta typeorm e nodejs.


# Como rodar esse projeto

- É necessário ter o [nodejs](https://nodejs.org/en/) instalado

- Instalar o [docker](https://www.docker.com/products/docker-desktop)

- Instalar a [imagem postgres](https://hub.docker.com/_/postgres) para o docker

- Criar um banco de dados postgres
  <pre>docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres</pre>

- Clonar esse projeto
  <pre>git clone https://github.com/MiguelBragaGarcia/desafio-database-relations.git</pre>

- Instalar todas as dependências
  <pre>yarn install</pre>
  
- Iniciar o servidor
  <pre>yarn dev:server</pre>

- Para testar nossas rotas eu escolhi o [insomnia](https://insomnia.rest/download/) 
  <pre>Importe de dentro da pasta Insomnia, desse projeto, a configuração para testar as rotas da aplicação</pre>
