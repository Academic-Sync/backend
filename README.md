Rotas de alunos, coordenadores, professores, turmas e cursos. Envio de emails ao criar aluno.
>Para enviar emails, é necessário criar <a href="https://myaccount.google.com/apppasswords?rapt=AEjHL4OQ0L3foz-LDBUJK3HzV_0cKD8whSP0HsSNcx0dQiUJsHCeNtP_L_bGOuAPwED8uokMMXCLYhq-si29EPSOKtmhiySfNxqALXmrVcJlKmJoHcN0euE"> senhas de APP pela conta do Google </a>

> Você pode acessar as requisições da API no Postman através do seguinte link: [Requisições no Postman](https://www.postman.com/joaoenrique/projeto-integrador/collection/2v80f7s/projeto-integrador?action=share&creator=33671486)

Frontend
https://piardigans.vercel.app/

Backend
https://pi-backend-jqsj.onrender.com

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2. Instale as dependências:
   ```bash
   npm run dev
    ```

3. Configure o banco de dados e as variáveis de ambiente no arquivo .env. Para enviar email, crie uma senha de app 
   ```bash
    # Database - funciona com mysql e postgre 
    DB_DIALECT=mysql # pode utilizar postgre
    DB_DATABASE=projeto_integrador
    DB_USER=root
    DB_PASSWORD=
    DB_PORT=3306 #trocar para 5432 se for postgre
    DB_HOST=localhost

    # EMAIL - é necessário criar um serviço SMTP
    SEND_MAIL=0 # Ativar envio de emails na criação de alunos (cuidado, pois ao criar aluno por arquivo, todos os alunos receberam o email)
    EMAIL_SERVICE='gmail'
    EMAIL_USER=
    EMAIL_PASS=sua-senha-de-app

    PORT=3000
   ```

4. Execute as migrações e seeds para preparar o banco de dados:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
    ```
5. Inicie o servidor:
   ```bash
   npm start
    ```

# Teste Unitário - Jest
1. npm test
![alt text](image.png)

# Explicação das rotas
Aluno
```js
GET /api/students
POST /api/students/store
POST /api/students/store-by-file
DELETE /api/students/{user_id}
PUT /api/students/{user_id}
```

Professor de TG
```js
GET /api/teachers
POST /api/teachers/store
DELETE /api/teachers/{user_id}
PUT /api/teachers/{user_id}
```

Coordenador
```js
GET /api/coordinators
POST /api/coordinators/store
DELETE /api/coordinators/{user_id}
PUT /api/coordinators/{user_id}
```

Curso
```js
GET /api/courses
POST /api/courses/store
DELETE /api/courses/{course_id}
PUT /api/courses/{course_id}
```

Turma
```js
GET /api/classes
POST /api/classes/store
DELETE /api/classes/{class_id}
PUT /api/classes/{class_id}
```

<br>

# Alunos

- **Listar Alunos**  
  `GET /api/students`  
  Retorna uma lista de todos os alunos cadastrados no sistema.

  Exemplo de retorno:
  ```json
  {
      "id": 195,
      "name": "Aluno 2",
      "email": "aluno@gmail.com",
      "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
      "user_type": "student",
      "code": "123456",
      "created_at": "2024-10-07T12:25:48.000Z",
      "updated_at": "2024-10-07T12:25:48.000Z"
  }
  ```
<br>

- **Criar Aluno**  
  `POST /api/students/store`  
  Cadastra um novo aluno. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do aluno (string, obrigatório)
  - `email`: Email do aluno (string, obrigatório)
  - `password`: Senha do aluno (string, obrigatório)
  - `code`: Código de matrícula ou identificação (string, opcional)

  Exemplo de corpo da requisição:
  ```json
  {
      "name": "Aluno",
      "email": "aluno@gmail.com",
      "password": "123",
      "code": "123456"
  }
  ```

  Exemplo de retorno:
  ```json
  {
    "message": "Aluno criado",
    "user": {
        "id": 195,
        "name": "Aluno",
        "email": "aluno@gmail.com",
        "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
        "user_type": "student",
        "code": "123456",
        "created_at": "2024-10-07T12:25:48.000Z",
        "updated_at": "2024-10-07T12:25:48.000Z"
    }
  }
  ```
<br>

- **Criar Aluno por arquivo**  
  `POST /api/students/store-by-file`  
  Permite o cadastro de vários alunos de uma só vez através de um arquivo XLSX. O arquivo deve conter os dados de cada aluno conforme o formato especificado. A requisição retorna os alunos que já estavam cadastrados.

  Exemplo de retorno:
  ```json
  {
      "message": "Alunos cadastrados",
      "existingStudentClass": []
  }
  ```
<br>

- **Apagar Aluno**  
  `DELETE /api/students/{user_id}`  
  Remove um aluno específico pelo user_id.

  Exemplo de retorno:
  ```json
  {
      "message": "Alunos apagado"
  }
  ```
<br>

- **Atualizar Aluno**  
    `PUT /api/students/{user_id}`

    Atualiza os dados de um aluno específico pelo `user_id`. Os campos de atualização podem ser enviados no corpo da requisição.
        
    Exemplo de retorno
    ```json
    {
        "message": "Aluno atualizado com sucesso",
        "user": {
            "id": 2,
            "name": "Aluno",
            "email": "aluno@gmail.com",
            "password": "$2b$10$/JdnAvu0wX8m6LyFJ0VZHusE7EfpC1Gf2Pw6x4zR9A8I6ynzRPWt2",
            "user_type": "student",
            "code": "22316",
            "created_at": "2024-10-07T12:36:43.000Z",
            "updated_at": "2024-10-07T12:36:43.000Z",
            "updatedAt": "2024-10-07T12:44:15.305Z"
        }
    }
    ```
<br>

# Professores

- **Listar Professores**  
  `GET /api/teachers`  
  Retorna uma lista de todos os professores cadastrados no sistema.

  Exemplo de retorno:
  ```json
  {
      "id": 5,
      "name": "Professor 1",
      "email": "professor@gmail.com",
      "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
      "user_type": "teacher",
      "created_at": "2024-10-07T12:25:48.000Z",
      "updated_at": "2024-10-07T12:25:48.000Z"
  }
  ```
<br>

- **Criar Professor**  
  `POST /api/teachers/store`  
  Cadastra um novo professor. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do professor (string, obrigatório)
  - `email`: Email do professor (string, obrigatório)
  - `password`: Senha do professor (string, obrigatório)

  Exemplo de corpo da requisição:
  ```json
  {
      "name": "Professor",
      "email": "professor@gmail.com",
      "password": "123",
      "code": "123456"
  }
  ```

  Exemplo de retorno:
  ```json
  {
    "message": "Professor criado",
    "user": {
        "id": 6,
        "name": "Professor",
        "email": "professor@gmail.com",
        "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
        "user_type": "teacher",
        "created_at": "2024-10-07T12:25:48.000Z",
        "updated_at": "2024-10-07T12:25:48.000Z"
    }
  }
  ```
<br>

- **Apagar Professor**  
  `DELETE /api/teachers/{user_id}`  
  Remove um professor específico pelo user_id.

  Exemplo de retorno:
  ```json
  {
    "message": "Professor apagado"
  }
  ```
<br>

- **Atualizar Professor**  
  `PUT /api/teachers/update/{user_id}`  
  Atualiza as informações de um professor existente. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do professor (string, opcional)
  - `email`: Email do professor (string, opcional)
  - `password`: Senha do professor (string, opcional)

  Exemplo de retorno
  ```json
  {
    "message": "Professor atualizado com sucesso",
    "user": {
      "name": "Professor",
      "email": "professor@gmail.com",
      "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
      "code": "123456"
    }
  }
  ```
<br>

# Coordenador

- **Listar Coordenador**  
  `GET /api/teachers`  
  Retorna uma lista de todos os coordenadores cadastrados no sistema.

  Exemplo de retorno:
  ```json
  {
      "id": 5,
      "name": "Coordenador 1",
      "email": "Coordenador@gmail.com",
      "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
      "user_type": "teacher",
      "created_at": "2024-10-07T12:25:48.000Z",
      "updated_at": "2024-10-07T12:25:48.000Z"
  }
  ```
  <br>

- **Criar Coordenador**  
  `POST /api/teachers/store`  
  Cadastra um novo Coordenador. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do Coordenador (string, obrigatório)
  - `email`: Email do Coordenador (string, obrigatório)
  - `password`: Senha do Coordenador (string, obrigatório)

  Exemplo de corpo da requisição:
  ```json
  {
      "name": "Coordenador",
      "email": "Coordenador@gmail.com",
      "password": "123",
      "code": "123456"
  }
  ```

  Exemplo de retorno:
  ```json
  {
    "message": "Coordenador criado",
    "user" : {
        "id": 6,
        "name": "Coordenador",
        "email": "Coordenador@gmail.com",
        "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
        "user_type": "coordinator",
        "created_at": "2024-10-07T12:25:48.000Z",
        "updated_at": "2024-10-07T12:25:48.000Z"
    }
  }
  ```
<br>

- **Apagar Coordenador**  
  `DELETE /api/teachers/{user_id}`  
  Remove um Coordenador específico pelo user_id.

  Exemplo de retorno:
  ```json
  {
    "message": "Coordenador apagado"
  }
  ```
<br>

- **Atualizar Coordenador**  
  `PUT /api/teachers/update/{user_id}`  
  Atualiza as informações de um Coordenador existente. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do Coordenador (string, opcional)
  - `email`: Email do Coordenador (string, opcional)
  - `password`: Senha do Coordenador (string, opcional)

  Exemplo de corpo da requisição:
  ```json
  {
    "message": "Coordenador atualizado com sucesso",
    "user": {
      "name": "Coordenador",
      "email": "Coordenador@gmail.com",
      "password": "$2b$10$MMRIPwMm5JG4e7x/ZNaf/.GtgIHRDbJei0tKqecKZ8JSXpFf.4YxO",
      "code": "123456"
    }
  }
  ```

# Curso

- **Listar Cursos**  
  `GET /api/courses`  
  Retorna uma lista de todos os cursos cadastrados no sistema.

  Exemplo de retorno:
  ```json
  {
    "id": 1,
    "name": "Analise e Desenvolvimento de Sistemas",
    "period": "noite",
    "is_annual": true,
    "type_work": "Teórico",
    "created_at": "2024-10-07T12:36:43.000Z",
    "updated_at": "2024-10-07T12:36:43.000Z",
    "coordinator_id": 1
  }
  ```
<br>

- **Criar Curso**  
  `POST /api/courses/store`
  
  Cadastra um novo curso. Requer os seguintes dados no corpo da requisição:
  - `name`: Nome do curso (string, obrigatório)
  - `period`: Periodo do curso (string, obrigatório)
  - `is_annual`: Se o curso é anual (boleano, obrigatório)
  - `type_work`: Tipo de trabalho (string, obrigatório)
  - `coordinator_id`: ID do coordenador responsável (inteiro, obrigatório)

  Exemplo de corpo da requisição:
  ```json
  {
    "coordinator_id": 1,
    "name": "ADS",
    "period": "tarde",
    "is_annual": true,
    "type_work": "monografia"
  }
  ```

  Exemplo de retorno:
  ```json
  {
    "message": "Curso criado",
    "course": {
        "id": 4,
        "coordinator_id": 1,
        "name": "ADS",
        "period": "tarde",
        "type_work": "monografia",
        "is_annual": true,
        "updatedAt": "2024-10-07T13:11:31.914Z",
        "createdAt": "2024-10-07T13:11:31.914Z"
    }
  }
  ```

- **Apagar Curso**  
  `DELETE /api/courses/{course_id}`  
  Remove um Curso específico pelo `course_id`.

  Exemplo de retorno:
  ```json
  {
    "message": "Curso apagado"
  }
  ```
<br>

- **Atualizar Curso**  
  `POST /api/courses/store`
  
  Atualiza os dados de um curso específico pelo `course_id`.

  Exemplo de retorno:
  ```json
  {
    "message": "Curso Atualizado",
    "course": {
        "id": 4,
        "coordinator_id": 1,
        "name": "ADS",
        "period": "tarde",
        "type_work": "monografia",
        "is_annual": true,
        "updatedAt": "2024-10-07T13:11:31.914Z",
        "createdAt": "2024-10-07T13:11:31.914Z"
    }
  }
  ```
<br>

# Turma

- **Listar Turmas**  
  `GET /api/courses`  
  Retorna uma lista de todas as turmas cadastradas no sistema.

  Exemplo de retorno:
  ```json
  {
    "id": 1,
    "semester": 1,
    "created_at": "2024-10-07T12:36:43.000Z",
    "updated_at": "2024-10-07T12:36:43.000Z",
    "teacher_id": 1,
    "course_id": 1
  }
  ```
<br>

- **Criar Turma**  
  `POST /api/classes/store`  
  Cadastra uma nova turma. Requer os seguintes dados no corpo da requisição:
  - `teacher_id`: ID do professor (inteiro, obrigatório)
  - `course_id`: ID do curso relacionado (inteiro, obrigatório)
  - `semester`: Semestre ou ano da turma (inteiro, obrigatório)

  Exemplo de corpo da requisição:
  ```json
  {
    "teacher_id": 1,
    "course_id": 1,
    "semester": 1
  }
  ```

  Exemplo de retorno:
  ```json
  {
    "message": "Turma criada",
    "class": {
        "id": 4,
        "semester": 1,
        "teacher_id": 1,
        "course_id": 1,
        "updatedAt": "2024-10-07T13:24:14.403Z",
        "createdAt": "2024-10-07T13:24:14.403Z"
    }
  }
  ```
<br>

- **Apagar Turma**  
  `DELETE /api/classes/{user_id}`  
  Remove uma turma específica pelo `class_id`.

  Exemplo de retorno:
  ```json
  {
      "message": "Turma apagada"
  }
  ```
<br>

- **Atualizar Turma**  
    `PUT /api/students/{class_id}`

    Atualiza os dados de uma turma específica pelo `class_id`.
        
    Exemplo de retorno
    ```json
    {
        "message": "Turma atualizada com sucesso",
        "class": {
            "id": 4,
            "semester": 1,
            "teacher_id": 1,
            "course_id": 1,
            "updatedAt": "2024-10-07T13:24:14.403Z",
            "createdAt": "2024-10-07T13:24:14.403Z"
        }
    }
    ```
<br>

---

## Observações
- As rotas usam `user_id`, `course_id` e `class_id` para identificar usuários, cursos e turmas respectivamente.
- As requisições `POST` e `PUT` exigem o envio dos dados no corpo da requisição em formato JSON.
- As rotas protegidas não necessitam de autenticação

---

## Tecnologias Utilizadas
- **Node.js**
- **Express**
- **Sequelize** (ORM para o banco de dados)
- **MySQL**

---

