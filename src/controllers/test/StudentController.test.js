const PasswordHelper = require("../../helpers/PasswordHelper.js");
const StudentController = require("../StudentController.js");
const EmailController = require("../EmailController.js");
const Student = require("../../models/Student.js");
const User = require("../../models/User.js");
const connection = require('../../database/connection.js')

jest.mock("../EmailController");

describe('Student Controller', () => {
  beforeEach(() =>{
    jest.clearAllMocks();
  })

  test('Should creane a student', async () => {
    const request= {
      body: {
          code: undefined,
          name: "Joao",
          email: "joao@gmail.com",
          password: "1234",
          hashedPassword: await PasswordHelper.encrypt('1234')
      }
    }

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    User.init(connection);

    await StudentController.store(request, response);
    expect(EmailController.sendPasswordEmail).toHaveBeenCalledTimes(1);
    
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Aluno criado",
        user: expect.any(Object) // ou a estrutura específica do objeto `user`
      }));
    })

    test('Should not creane a student', async () => {
      const mockCreate = jest.spyOn(Student, 'create').mockRejectedValue(new Error("Erro ao criar aluno"));

      const request= {
        body: {
            code: undefined,
            name: "Joao",
            email: "joao@gmail.com",
            password: "1234",
            hashedPassword: await PasswordHelper.encrypt('1234')
        }
      }

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  

      await StudentController.store(request, response);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ error: "Erro ao criar aluno" });
    })
})