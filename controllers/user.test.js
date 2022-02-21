jest.mock("../models/user"); 
// require을 통해 가지고 오는 객체들을 jest.mock으로 복사한다. 

const User = require("../models/user"); 
const {addFollowing} = require("./user"); 


describe("addFollowing", ()=>{
    const req = {
        user : {id : 1},
        params : {id : 2},
    };
    const res = {
        status : jest.fn(()=>res),
        send : jest.fn(),
    }; 
    const next = jest.fn();
    console.error = jest.fn(); 

    test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async()=>{
        User.findOne.mockReturnValue(Promise.resolve({
            addFollowing(id) {
                return Promise.resolve(true); 
            }
        })); 

        await addFollowing(req,res,next); 
        expect(res.send).toBeCalledWith('success'); 
    }); 

    test("사용자를 못 찾으면 res.status(404).send(no user)를 호출해야 함", async ()=>{

        User.findOne.mockReturnValue(Promise.resolve(null)); 
        
        await addFollowing(req,res,next); 
        expect(res.status).toBeCalledWith(404); 
        expect(res.send).toBeCalledWith('no user'); 

    }); 
    
    test("DB에서 에러가 발생하면 next(error) 호출한다.", async()=>{
       
        const err = "테스트용 에러"; 

        User.findOne.mockReturnValue(Promise.reject(err)); 

        await addFollowing(req,res,next); 

        expect(console.error).toBeCalledWith(err); 
        expect(next).toBeCalledWith(err); 
    });
})