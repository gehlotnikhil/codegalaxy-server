import { Request, Response, Router } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();
const { body, validationResult } = require("express-validator");
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "Contest Routing is on" });
});

router.post(
  "/create",
  [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
    body("startTime", "Please Enter a startTime").exists(),
    body("problems", "Please Enter a problems's id").exists(),
    body("status", "Please Enter a status").exists(),
    body("noOfParticipated", "Please Enter a noOfParticipated").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;

    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let {
        contestName,
        duration,
        startTime,
        problems,
        status,
        noOfParticipated,
      } = req.body;
      let no = await prisma.contest.count();
      console.log(no);
      let result = await prisma.contest.create({
        data: {
          contestNo: no + 1,
          contestName,
          duration,
          startTime: new Date(startTime),
          problems,
          status,
          noOfParticipated,
        },
      });
      console.log(result);

      success = true;
      return res.send({ success, body: req.body, msg: "Contest Created" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.put(
  "/update/:contestno",
  [],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }

      let query: any = {};
      if (req.body.contestName) {
        query.contestName = req.body.contestName;
      }
      if (req.body.startTime) {
        query.problemName = req.body.startTime;
      }
      if (req.body.duration) {
        query.startTime = req.body.duration;
      }
      if (req.body.status) {
        query.status = req.body.status;
      }
      if (req.body.noOfParticipated) {
        query.noOfParticipated = req.body.noOfParticipated;
      }
      if (req.body.problems) {
        query.problems = req.body.problems;
      }
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" });
      }
      let result = await prisma.contest.update({
       where:{contestNo:Number.parseInt(req.params.contestno)},data:{...query}
      });

      success = true;
      return res.send({ success ,msg:"Update successfull"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);
router.delete(
  "/delete/:contestno",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let check1 = await prisma.contest.findFirst({where:{contestNo:Number.parseInt(req.params.contestno)}})
      if(!check1){
        return res.send({success,msg:"Contest not Exist"})
      }

      let result = await prisma.contest.delete({where:{contestNo:Number.parseInt(req.params.contestno)}})

      success = true;
      return res.send({ success ,msg:"Deleted",result});
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.get(
  "/getallcontest",
  [],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
        let result = await prisma.contest.findMany()
        console.log(result);

      success = true;
      return res.send({ success ,result});
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);
router.get(
  "/getspecificcontest/:contestno",
  [],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
        let result = await prisma.contest.findFirst({where:{contestNo:Number.parseInt(req.params.contestno)}})
console.log(result);

      success = true;
      return res.send({ success ,result});
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

module.exports = router;
