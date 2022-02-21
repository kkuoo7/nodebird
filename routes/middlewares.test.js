
const {isLoggedin, isNotLoggedin} = require("./middlewares"); 

describe('isLoggedin',()=>{

    const res = {
        status : jest.fn(()=>res), // jest.fn()으로 가짜객체를 만드는 Mocking을 한다. 
        redirect : jest.fn(), 
    }; 

    const next = jest.fn(); 

    test('로그인이 되어 있으면 isLoggedin이 next를 호출해야한다.', ()=>{
        const req = {
            isAuthenticated : jest.fn(()=>true)
        }; // 이건 테스타가 아님 테스트를 하기 위해 조건을 설정하는 것이다. 

        isLoggedin(req,res,next); 
        expect(next).toHaveBeenCalledTimes(1); // 정확히 말하자면 이 부분이 테스트이다. 
    }); 

    test("로그인이 되어 있지 않으면 에러를 응답해야한다.",()=>{
        const req = {
            isAuthenticated : jest.fn(()=>{false}), // 마찬가지로 테스트를 위한 조건을 설정하는 것이다. 
        }; 

        isLoggedin(req,res,next); 
        expect(res.status).toBeCalledWith(403);
        expect(res.redirect).toBeCalledWith('/'); // 이 부분이 테스트다. 
    });
}); 

describe("isNotLoggedin",()=>{

    const res = {
        redirect : jest.fn(),
    };
    const next = jest.fn(); 
      
    test("로그인이 되어 있으면 isNotLoggedin이 에러를 응답해야 한다.",()=>{
        const req = {
            isAuthenticated : jest.fn(()=>true)
        };

        isNotLoggedin(req,res,next); 
        const message = encodeURIComponent('로그인한 상태입니다.'); 
        expect(res.redirect).toBeCalledWith(`?/error=${message}`);
    }); 

    test("로그인이 되어 있지 않으면 isNotLoggedin이 next를 호출해야 한다.",()=>{
        const req = {
            isAuthenticated : jest.fn(()=>false)
        };

        isNotLoggedin(req,res,next);
        expect(next).toHaveBeenCalledTimes(1); 
    });
}); 