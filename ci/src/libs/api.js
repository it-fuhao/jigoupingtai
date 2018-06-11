// API接口

var DOMAIN = "";

module.exports = {
    //后台登陆地址
    ADMIN:{
        //后台用户登录提交地址
        CITYLOGIN: DOMAIN + "/admin/user/doLogin",
        //后台分配权限
        POWER: DOMAIN + "/super/User/power"
    },
    
    // 验证码
    VCODE: DOMAIN + "/captcha",
    NOTEVCODE: DOMAIN + "/sms/Sms/send/",
    // 用户登录
    USER: {
        LOGIN: DOMAIN + "/user/login",
        REGISTER: DOMAIN + "/user/create",
        REVISE: DOMAIN + "/user/resetpassword",
        CITYLOGIN: DOMAIN + "/api/login.php"
    },
    //筹设表单
    PREPARE: {
        SAVE: DOMAIN + "/Preapply/preSave",
        SUBMIT: DOMAIN + "/Preapply/preSubmit"
    },
    //正式设立表单
    SETUP: {
        DEL: DOMAIN + "",
        SETUPSAVE: DOMAIN + "",
        SETUPSUBMIT: DOMAIN + "",
        SETUPAUDIT: DOMAIN + "" //正式设立审核接口
    },
    //预约接口
    SUBSCRIBE: {
        SUBMIT: DOMAIN + "/UsersBespeak/addBespeak",
        CANCEL: DOMAIN + "",
        //后台预约管理
        ADMINAPPO: DOMAIN + "/sign/save_role"
    },
    //办学变更接口
    CHANGE: {
        DEL: DOMAIN + "/api/save.php"
    },
    //备案接口
    RECORD: {
        DEL: DOMAIN + "/api/save.php"
    },
    // 筹设审批
    APPROVE: {
        CONSENT: DOMAIN + "/ManagePrepare/checkPass",
        NOCONSENT: DOMAIN + "ManagePrepare/disagreePrepareSubmit"
    },
    //登记接口
    REGISTER: {
        SAVE: DOMAIN + "/register/TaskReg/createTask",
        TASKDEL: DOMAIN + "/register/TaskReg/showDelete",
        ADD: DOMAIN + "/register/TaskForm/formCreate",
        DEL: DOMAIN + "/register/TaskForm/formDel",
        ADDFLOW: DOMAIN + "/register/TaskFormFlow/flowCreat",
        DELFLOW: DOMAIN + "/register/TaskFormFlow/flowDel",
        PUBLISH: DOMAIN + "/register/TaskReg/publishTask",
        CUSTOMFORM:DOMAIN + "/register/TaskForm/formDetail",
        TASKSUBMIT:DOMAIN + "/UserTask/taskSubmit",
    },
    //审核登记接口
    REGISTERlOOK: {
        SUCCESS: DOMAIN +"/register/UserSubmitForm/detailStatus",
        ERR: DOMAIN + "/register/UserSubmitForm/submitStep"

    },


    //后台添加用户接口
    ADDUSER: {
        SAVE: DOMAIN + "/super/User/create"
    }
    
    
}